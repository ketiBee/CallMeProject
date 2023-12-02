from locust import User, task, between
import socketio

# Set up the socket.io client
sio = socketio.Client()

class SocketIOUser(User):
    wait_time = between(1, 5)  # Time between consecutive task executions

    def on_start(self):
        # Connect to the socket.io server
        sio.connect("http://localhost:4200")

    @task
    def send_message(self):
        # Implement your specific socket.io events and data here
        # For example, if you want to emit an event "message" with data "Hello, world!":
        sio.emit("create-room", "ketiBit")

    def on_stop(self):
        # Disconnect from the socket.io server when the test is done
        sio.disconnect()