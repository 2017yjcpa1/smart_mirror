using System;

namespace KinectBody {

    class Program {

        static void Main(string[] args) {
            KinectServer s = new KinectServer();

            KinectController c = new KinectController();
            c.OnKinectReceivedBody += (o, e) => {
                s.Broadcast(e.Skeleton);
            };

            s.Start();

            Console.WriteLine("Kinect 서버가 시작되었습니다.");
            Console.WriteLine("아무키를 눌러 서버를 종료할 수 있습니다.");
            Console.ReadKey();

            s.Stop();
        }
    }
}
