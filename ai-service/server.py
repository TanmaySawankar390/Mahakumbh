import cv2
import numpy as np
import time
from collections import deque
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import uvicorn
import streamlit as st
from io import BytesIO
import requests

app = FastAPI()

# Global detection settings
MOTION_SENSITIVITY = 0.4  # Very low threshold for motion detection

class StampedeDetector:
    def __init__(self):
        self.prev_gray = None
        self.frame_count = 0
        self.in_stampede = False
        self.stampede_count = 0
        self.stampede_start_time = None
        self.detection_queue = deque(maxlen=60)  # adjust based on fps, here assuming ~40-60

    def process_frame(self, img):
        self.frame_count += 1
        frame_display = img.copy()
        
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        if self.prev_gray is not None:
            flow = cv2.calcOpticalFlowFarneback(
                self.prev_gray, gray, None,
                pyr_scale=0.5, levels=3, winsize=15,
                iterations=3, poly_n=5, poly_sigma=1.1, flags=0
            )
            magnitude = np.sqrt(flow[..., 0]**2 + flow[..., 1]**2)
            avg_motion = np.mean(magnitude)
            
            angles = np.arctan2(flow[..., 1], flow[..., 0])
            hist, _ = np.histogram(angles, bins=8, range=(-np.pi, np.pi))
            max_direction = np.max(hist) / (np.sum(hist) + 1e-5)
            
            is_stampede_frame = avg_motion > MOTION_SENSITIVITY and max_direction > 0.3
            self.detection_queue.append(1 if is_stampede_frame else 0)
            
            # Count consecutive detections
            consecutive_detections = 0
            for val in reversed(self.detection_queue):
                if val == 1:
                    consecutive_detections += 1
                else:
                    if consecutive_detections < 3:
                        consecutive_detections = 0
                    else:
                        break
            
            if consecutive_detections >= int(0.6 * self.detection_queue.maxlen) and not self.in_stampede:
                self.in_stampede = True
                self.stampede_start_time = time.time()
                self.stampede_count += 1
                return "STAMPEDE DETECTED"
            elif consecutive_detections < int(0.3 * self.detection_queue.maxlen) and self.in_stampede:
                self.in_stampede = False
                duration = time.time() - self.stampede_start_time if self.stampede_start_time else 0
                return f"Stampede ended ({duration:.1f}s)"
            else:
                return "Normal Activity"
                       
        self.prev_gray = gray.copy()
        return "Normal Activity"

detector = StampedeDetector()

@app.post("/process_frame/")
async def process_frame(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    result = detector.process_frame(img)
    
    # Send the result to the specified URI only if a stampede is detected
    if result == "STAMPEDE DETECTED":
        try:
            response = requests.post("http://localhost:5173", json={"result": result})
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"Failed to send alert: {e}")
    
    return JSONResponse(content={"result": result})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Streamlit app
st.title("Stampede Detection API")
st.write("This API processes video frames to detect stampede events.")