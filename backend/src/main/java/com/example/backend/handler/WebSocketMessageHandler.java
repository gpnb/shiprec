package com.example.backend.handler;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class WebSocketMessageHandler extends TextWebSocketHandler{
    
    
    private static final List<WebSocketSession> webSocketSessions = new CopyOnWriteArrayList<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        webSocketSessions.add(session); 
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) throws Exception {
        webSocketSessions.remove(session); 
    }

    public static List<WebSocketSession> getWebSocketSessions() {
        return webSocketSessions;
    }
}
