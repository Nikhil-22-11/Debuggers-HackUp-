import numpy as np
from sklearn.ensemble import IsolationForest

class BotDetectorML:
    def __init__(self):
        # Isolation Forest is great for unsupervised anomaly detection
        self.model = IsolationForest(
            n_estimators=100,
            contamination=0.05, # Expecting roughly 5% anomalies in a random dataset, but we train on pure normal
            random_state=42
        )
        self.is_trained = False
        self._train_initial_model()

    def _train_initial_model(self):
        """
        Train the model on synthetic 'normal' human behavior.
        Features: [requests_per_min, failed_logins, time_gap_ms, typing_speed, mouse_speed]
        
        Normal human behavior roughly:
        - requests_per_min: 5 to 30
        - failed_logins: 0 to 1
        - time_gap_ms: 2000 to 15000 (2 to 15 seconds)
        - typing_speed: 1.0 to 5.0 keystrokes/sec
        - mouse_speed: 50.0 to 500.0 pixels/sec
        """
        np.random.seed(42)
        
        # Generate 1000 normal human samples
        requests_per_min = np.random.uniform(5, 30, 1000)
        failed_logins = np.random.poisson(0.1, 1000) # Mostly 0, some 1s
        time_gap_ms = np.random.uniform(2000, 15000, 1000)
        typing_speed = np.random.uniform(1.0, 5.0, 1000)
        mouse_speed = np.random.uniform(50.0, 500.0, 1000)
        
        X_train = np.column_stack((
            requests_per_min,
            failed_logins,
            time_gap_ms,
            typing_speed,
            mouse_speed
        ))
        
        self.model.fit(X_train)
        self.is_trained = True

    def predict_anomaly(self, features: list) -> bool:
        """
        Returns True if ANOMALY (Bot), False if NORMAL (Human).
        Expected features shape: [requests_per_min, failed_logins, time_gap_ms, typing_speed, mouse_speed]
        """
        if not self.is_trained:
            return False
            
        X_test = np.array(features).reshape(1, -1)
        
        # predict returns 1 for inliers, -1 for outliers
        prediction = self.model.predict(X_test)[0]
        
        return prediction == -1

ml_detector = BotDetectorML()
