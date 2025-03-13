import platform
import subprocess
import re

def get_traceroute_command(destination: str):
    system = platform.system()
    if system == "Windows":
        return ["tracert", destination]
    elif system in ("Linux", "Darwin"):  # Darwin is macOS
        return ["traceroute", destination]
    else:
        raise OSError(f"Unsupported OS: {system}")

def perform_traceroute(destination: str):
    command = get_traceroute_command(destination)
    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if result.returncode != 0:
        raise Exception(f"Traceroute failed: {result.stderr}")

    hops = []
    for line in result.stdout.splitlines():
        ip_match = re.search(r"\(([\d.]+)\)", line)
        time_match = re.search(r"(\d+\.\d+)\s?ms", line)
        if ip_match and time_match:
            ip_address = ip_match.group(1)
            response_time = float(time_match.group(1))
            hops.append({
                "IP Address": ip_address,
                "Time": response_time,
                "Anomaly": False 
            })
    return hops
