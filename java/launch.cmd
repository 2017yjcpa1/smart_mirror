@echo off
SET CLASSPATH=dist/*;lib/*;
java -Xms256m -Xmx1024m -Xss128k com.github.aw9223.motionjs.Main
@pause