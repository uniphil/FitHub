import time
import json
import argparse
import tornado.ioloop
import tornado.web
import tornado.websocket

class LoopbackHandler(tornado.websocket.WebSocketHandler):
  def initialize(self, data):
    self.data = data
    self.i = 0

  def open(self):
    print "WebSocket opened"
    self.send_next_message();

  def send_next_message(self):
    self.write_message(json.dumps(self.data[self.i]))
    self.i = (self.i + 1) % len(self.data)
    time.sleep(1.0/30)

  def on_message(self, message):
    self.send_next_message();

  def on_close(self):
    print "WebSocket closed"


if __name__ == '__main__':
  parser = argparse.ArgumentParser(description="Loopback kinect mock server")
  parser.add_argument('--data_file', default='jumping_jacks.json')
  parser.add_argument('--port', type=int, default=8082)

  args = parser.parse_args()
  with open(args.data_file, 'r') as f:
    json_data = f.read()
  data = json.loads(json_data)

  app = tornado.web.Application([
    (r'/KinectHtml5', LoopbackHandler, {'data' : data}),
  ])
  app.listen(args.port)
  tornado.ioloop.IOLoop.instance().start()
