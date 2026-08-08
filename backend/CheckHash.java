import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class CheckHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = "$2a$10$wY9/ZcW.jP2Yp0oHh.XbI.U0C.f8S1P50f/7Y0K9w2Ww1h/u/kOqG";
        System.out.println("Matches: " + encoder.matches("admin123", hash));
    }
}
