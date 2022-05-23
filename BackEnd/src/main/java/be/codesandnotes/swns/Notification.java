package be.codesandnotes.swns;
import java.util.*;

public class Notification {

    public String text;

    public Notification() {
    }

    public Notification(String text , int count) {
        this.text = text;
        this.count = count;

    }
    public Notification(int count) {
        this.count = count;
    }
    private int count;

    public int getCount() {
        return count;
    }
    public void setCount(int count) {
        this.count = count;
    }
    public void increment() {
        this.count++;
    }
}
