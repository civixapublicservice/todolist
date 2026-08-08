import wave
import struct
import math
import os

def generate_tone(filename, frequency, duration_ms, volume=0.5, envelope='click'):
    sample_rate = 44100.0
    num_samples = int(sample_rate * (duration_ms / 1000.0))
    
    os.makedirs('public/sounds', exist_ok=True)
    
    with wave.open(f'public/sounds/{filename}', 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        for i in range(num_samples):
            time = i / sample_rate
            
            # basic sine wave
            value = math.sin(2.0 * math.pi * frequency * time)
            
            # apply envelope
            if envelope == 'click':
                # very fast decay
                env = math.exp(-i / (num_samples * 0.1))
            elif envelope == 'chime':
                # slightly longer decay
                env = math.exp(-i / (num_samples * 0.4))
            else:
                env = 1.0
                
            sample = value * env * volume * 32767.0
            
            # Pack as 16-bit PCM
            wav_file.writeframes(struct.pack('h', int(sample)))

if __name__ == "__main__":
    # Generate UI click (short, low frequency)
    generate_tone('ui-click.wav', frequency=400, duration_ms=50, volume=0.3, envelope='click')
    
    # Generate Notification chime (longer, higher frequency, pleasant)
    generate_tone('notif-chime.wav', frequency=880, duration_ms=600, volume=0.4, envelope='chime')
    
    print("Audio files generated in public/sounds/")
