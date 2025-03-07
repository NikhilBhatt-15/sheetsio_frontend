let socket: WebSocket | null = null;

export function connectWebSocket(sheetId: string, onDataUpdate: (data: string[][]) => void) {
    if (socket) {
      disconnectWebSocket(); // Properly close any existing connection before creating a new one
    }
  
    socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_BACKEND_URL}`); // Adjust URL if needed
  
    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      socket?.send(JSON.stringify({ type: "connect", sheetId }));
    };
  
    socket.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        console.log("📩 Data received:", newData);
        onDataUpdate(newData);
      } catch (error) {
        console.error("❌ Error parsing WebSocket message:", error);
      }
    };
  
    socket.onerror = (error) => {
      console.error("⚠️ WebSocket error:", error);
    };
  
    socket.onclose = () => {
      console.log("🔴 WebSocket disconnected");
    };
  }
  

export function disconnectWebSocket() {
    if (socket) {
      // Ensure WebSocket is OPEN before sending 'disconnect' message
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "disconnect" }));
      }
      socket.close();
      socket = null;
    }
  }

export function getSheetId(sheetUrl: string){
    const sheetId = sheetUrl.split("/")[5];
    return sheetId;
}