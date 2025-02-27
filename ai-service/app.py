import cv2
import numpy as np
import time
from collections import deque


video_path = "sample.mp4"
cap = cv2.VideoCapture(video_path)
if not cap.isOpened():
    print(f"Error: Could not open video file {video_path}")
    exit()


fps = cap.get(cv2.CAP_PROP_FPS)
if fps <= 0:
    fps = 30 

# HYPER-SENSITIVE DETECTION SETTINGS
MIN_SUSTAINED_FRAMES = int(fps * 1.5)  # Only 1.5 seconds needed (very sensitive)
MOTION_SENSITIVITY = 0.4  # Very low threshold for motion detection

# Tracking variables
frame_count = 0
prev_gray = None
in_stampede = False
stampede_count = 0
stampede_start_time = None
detection_queue = deque(maxlen=MIN_SUSTAINED_FRAMES*2)

print("Starting HIGHLY SENSITIVE stampede detection...")
print(f"Only {MIN_SUSTAINED_FRAMES} frames ({MIN_SUSTAINED_FRAMES/fps:.1f} seconds) needed to trigger alert")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
        
    frame_count += 1
    frame_display = frame.copy()
    
    # Convert to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Process motion
    if prev_gray is not None:
        # Calculate optical flow - simplified parameters for speed
        flow = cv2.calcOpticalFlowFarneback(
            prev_gray, gray, None, 
            pyr_scale=0.5, levels=3, winsize=15,
            iterations=3, poly_n=5, poly_sigma=1.1, flags=0
        )
        
        # Calculate magnitude and direction
        magnitude = np.sqrt(flow[..., 0]**2 + flow[..., 1]**2)
        avg_motion = np.mean(magnitude)
        
        # Get motion direction consistency
        angles = np.arctan2(flow[..., 1], flow[..., 0])
        hist, _ = np.histogram(angles, bins=8, range=(-np.pi, np.pi))
        max_direction = np.max(hist) / (np.sum(hist) + 1e-5)
        
        # EXTREMELY SIMPLE DETECTION - just looking for significant motion
        is_stampede_frame = avg_motion > MOTION_SENSITIVITY and max_direction > 0.3
        
        # Add to detection queue
        detection_queue.append(1 if is_stampede_frame else 0)
        
        # Count consecutive detections (with high tolerance)
        consecutive_detections = 0
        for i in range(len(detection_queue) - 1, -1, -1):
            if detection_queue[i] == 1:
                consecutive_detections += 1
            else:
                # Break only after seeing 3 consecutive non-detections
                if consecutive_detections < 3:
                    consecutive_detections = 0
                else:
                    break
        
        # Manage stampede state
        if consecutive_detections >= MIN_SUSTAINED_FRAMES * 0.6 and not in_stampede:
            # Start stampede
            in_stampede = True
            stampede_start_time = time.time()
            stampede_count += 1
            print(f"\n*** STAMPEDE DETECTED! ({consecutive_detections} frames) ***")
            print(f"Motion: {avg_motion:.2f}, Direction: {max_direction:.2f}")
        elif consecutive_detections < MIN_SUSTAINED_FRAMES * 0.3 and in_stampede:
            # End stampede
            in_stampede = False
            duration = time.time() - stampede_start_time if stampede_start_time else 0
            print(f"Stampede ended after {duration:.1f} seconds")
            
        # Display status
        if in_stampede:
            duration = time.time() - stampede_start_time if stampede_start_time else 0
            status_text = f"STAMPEDE DETECTED! Duration: {duration:.1f}s"
            color = (0, 0, 255)  # Red
            
            # Add flashing effect
            if frame_count % 6 < 3:
                overlay = np.zeros_like(frame_display)
                overlay[:,:,2] = 255  # Red channel
                frame_display = cv2.addWeighted(frame_display, 0.7, overlay, 0.3, 0)
        else:
            detection_ratio = consecutive_detections / MIN_SUSTAINED_FRAMES
            if detection_ratio > 0.8:
                status_text = f"IMMINENT STAMPEDE WARNING! ({detection_ratio*100:.0f}%)"
                color = (0, 80, 255)  # Orange-red
            elif detection_ratio > 0.5:
                status_text = f"SUSPICIOUS ACTIVITY ({detection_ratio*100:.0f}%)"
                color = (0, 165, 255)  # Orange
            elif detection_ratio > 0.3:
                status_text = f"Heightened Movement ({detection_ratio*100:.0f}%)"
                color = (0, 255, 255)  # Yellow
            else:
                status_text = f"Normal Activity"
                color = (0, 255, 0)  # Green
        
        # Add text to display
        cv2.putText(frame_display, status_text, (10, 30), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
                    
        # Add metrics
        metrics_text = f"Motion: {avg_motion:.2f}, Direction: {max_direction:.2f}, Frames: {consecutive_detections}/{MIN_SUSTAINED_FRAMES}"
        cv2.putText(frame_display, metrics_text, (10, 60), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
                    
        # Create visualization of motion
        norm_magnitude = cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
        heat_map = cv2.applyColorMap(norm_magnitude, cv2.COLORMAP_JET)
        motion_vis = cv2.addWeighted(frame, 0.7, heat_map, 0.3, 0)
        
        # Show the direction with arrows on high motion areas
        step = 20
        for y in range(0, flow.shape[0], step):
            for x in range(0, flow.shape[1], step):
                fx, fy = flow[y, x]
                if np.sqrt(fx*fx + fy*fy) > 1.5:
                    cv2.arrowedLine(motion_vis, (x, y), (int(x + fx), int(y + fy)), (0, 255, 255), 1, tipLength=0.3)
        
        cv2.imshow('Motion Analysis', motion_vis)
    
    prev_gray = gray.copy()
    cv2.imshow('Stampede Detection', frame_display)
    
    if cv2.waitKey(30) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
print(f"Detection completed. Found {stampede_count} stampede events.")