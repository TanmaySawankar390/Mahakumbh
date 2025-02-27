// Simple logging utility for consistent log formatting

const logger = {
  info: (message, data = null) => {
    const logEntry = {
      level: "INFO",
      timestamp: new Date().toISOString(),
      message,
    };

    if (data) {
      logEntry.data = data;
    }

    console.log(JSON.stringify(logEntry));
  },

  error: (message, error = null) => {
    const logEntry = {
      level: "ERROR",
      timestamp: new Date().toISOString(),
      message,
    };

    if (error) {
      logEntry.error =
        error instanceof Error
          ? { message: error.message, stack: error.stack }
          : error;
    }

    console.error(JSON.stringify(logEntry));
  },

  debug: (message, data = null) => {
    if (process.env.NODE_ENV !== "production") {
      const logEntry = {
        level: "DEBUG",
        timestamp: new Date().toISOString(),
        message,
      };

      if (data) {
        logEntry.data = data;
      }

      console.debug(JSON.stringify(logEntry));
    }
  },
};

export default logger;
