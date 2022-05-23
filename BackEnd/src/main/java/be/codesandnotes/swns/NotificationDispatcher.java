package be.codesandnotes.swns;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class NotificationDispatcher {

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationDispatcher.class);

    private final SimpMessagingTemplate template;

    private Set<String> listeners = new HashSet<>();

    public NotificationDispatcher(SimpMessagingTemplate template) {
        this.template = template;
    }

    public void add(String sessionId) {
        listeners.add(sessionId);
    }

    public void remove(String sessionId) {
        listeners.remove(sessionId);
    }

    // Initialize Notifications
    private Notification notifications = new Notification("An action has been done by candidate/manager/hr-responsible",0);

    //Setting notifications to zero
    private Notification notif = new Notification(0);



    //@Scheduled(fixedDelay = 2000)
    public void dispatch() {
        for (String listener : listeners) {
            LOGGER.info("Sending notification to " + listener);
            SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
            headerAccessor.setSessionId(listener);
            headerAccessor.setLeaveMutable(true);
            // Increment Notification by one
            notifications.increment();
            template.convertAndSendToUser(
                    listener,
                    "/notification/item",
                     notifications,
                    headerAccessor.getMessageHeaders());
        }
    }

    public void setToZero() {
        for (String listener : listeners) {
            LOGGER.info("Setting notifications to zero starting" + listener);
            SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
            headerAccessor.setSessionId(listener);
            headerAccessor.setLeaveMutable(true);
            notifications.setCount(0);
            template.convertAndSendToUser(
                    listener,
                    "/notification/item",
                    notif,
                    headerAccessor.getMessageHeaders());
        }
    }

    @EventListener
    public void sessionDisconnectionHandler(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        LOGGER.info("Disconnecting " + sessionId + "!");
        remove(sessionId);
    }
}
