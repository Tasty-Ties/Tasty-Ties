package com.teamcook.tastyties.security.userdetails;

import com.teamcook.tastyties.user.entity.User;
import com.teamcook.tastyties.user.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws BadCredentialsException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadCredentialsException(username));
        return new CustomUserDetails(user);
    }
}
