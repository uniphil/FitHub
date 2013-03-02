import time
import json
import argparse
import tornado.ioloop
import tornado.web
import tornado.websocket

class LoopbackHandler(tornado.websocket.WebSocketHandler):
  def initialize(self, data):
    self.data = data

  def open(self):
    print "WebSocket opened"
    i = 0
    while True:
      self.write_message(json.dumps(self.data[i]))
      i = (i + 1) % len(self.data)
      time.sleep(1.0/12)

  def on_message(self, message):
    pass

  def on_close(self):
    print "WebSocket closed"


if __name__ == '__main__':
  parser = argparse.ArgumentParser(description="Loopback kinect mock server")
  parser.add_argument('--data_file', default='jumping_jacks.json')

  args = parser.parse_args()
  with open(args.data_file, 'r') as f:
    json_data = f.read()
  data = json.loads(json_data)

  app = tornado.web.Application([
    (r'/KinectHtml5', LoopbackHandler, {'data' : data}),
  ])
  app.listen(8181)
  tornado.ioloop.IOLoop.instance().start()
