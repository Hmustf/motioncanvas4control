import numpy as np
from scipy import signal
import json
import matplotlib.pyplot as plt
import os

# System parameters
wn = 2.0  # Natural frequency
zeta = 0.5  # Damping ratio

# Create transfer function using scipy
num = [wn**2]
den = [1, 2*zeta*wn, wn**2]
system = signal.TransferFunction(num, den)

# Generate time points from 0 to 10 seconds
t = np.linspace(0, 10, 5000)

# Calculate step response using scipy
t, y = signal.step(system, T=t)

# Calculate peak time and value
peak_time = np.pi/(wn*np.sqrt(1-zeta**2)) if zeta < 1 else 0
peak_value = 1 + np.exp(-np.pi*zeta/np.sqrt(1-zeta**2)) if zeta < 1 else 1

# Calculate peak time percentage (for animation timing)
peak_time_percentage = peak_time / 10.0

# Create points array for Motion Canvas
points = [[float(t[i]), float(y[i])] for i in range(len(t))]

# Save points and timing information
data = {
    'points': points,
    'peak_time_percentage': float(peak_time_percentage),
    'peak_value': float(peak_value)
}

# Save to JSON file
json_path = 'response_points.json'
with open(json_path, 'w') as f:
    json.dump(data, f)

print(f"\nPeak occurs at {peak_time:.2f}s ({peak_time_percentage*100:.1f}% of animation)")
print(f"Peak value: {peak_value:.3f}") 