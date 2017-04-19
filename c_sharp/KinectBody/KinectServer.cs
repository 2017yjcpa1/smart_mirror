using System;
using System.Collections.Generic;
using Fleck;

namespace KinectBody {
    
    public class KinectServer {

        private WebSocketServer mServer = null;
        private List<IWebSocketConnection> mSockets = new List<IWebSocketConnection>();

        public KinectServer() {
            mServer = new WebSocketServer("ws://0.0.0.0:9003/");
        }

        public void Start() {
            mServer.Start(s => {
                s.OnOpen = () => { mSockets.Add(s); };
                s.OnClose = () => { mSockets.Remove(s); };
            });
        }

        public void Broadcast(string message) {

            foreach (IWebSocketConnection s in mSockets) {
                s.Send(message);
            }
        }

        public void Stop() {

            foreach (IWebSocketConnection s in mSockets) {
                s.Close();
            }

            mServer.Dispose();
        }
    }
}
