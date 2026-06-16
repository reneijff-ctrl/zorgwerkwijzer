package nl.zorgwerkwijzer.exception;

public class SubscriptionLimitException extends RuntimeException {

    public SubscriptionLimitException(String message) {
        super(message);
    }
}
