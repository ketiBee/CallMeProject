
from bzt import TaurusConfigError, TaurusInternalException
from bzt.modules import SocketIOExecutor

class MySocketIOExecutor(SocketIOExecutor):
    def startup(self):
        super(MySocketIOExecutor, self).startup()

    def _send_message(self):
        # Implement your specific socket.io events and data here
        # For example, if you want to emit an event "message" with data "Hello, world!":
        self.send_message("create-room", "ketiBit")

    def run(self):
        try:
            # Replace with your socket.io app start command
            self.start_time = self.get_current_ms_time()
            self._send_message()
            self.check(self.get_last_response())
        except (TaurusConfigError, TaurusInternalException) as exc:
            self.log.debug("%s", exc)
            self.log.debug("Setting failed status")
            self.log.debug("", exc_info=True)
            self.runner.engine.aggregator.add_error(self._class.name_, self.label, "SocketIO error: %s" % exc)
            self.runner.engine.aggregator.set_last_status(False)
        finally:
            self.log.debug("SocketIO finished")

    def check(self, reply):
        if not self.check_response(reply):
            raise TaurusInternalException("Bad response: %s" % reply)
        self.log.debug("Received reply: %s", reply)

    def get_last_response(self):
        """
        Get the last received response from socket.io
        """
        return self.get_response()