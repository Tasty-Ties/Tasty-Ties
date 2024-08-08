package com.teamcook.tastytieschat.security.userdetails;

import com.teamcook.tastytieschat.user.entity.User;
import com.teamcook.tastytieschat.user.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadCredentialsException(username));
        if (user.isDeleted()) {
            throw new BadCredentialsException("탈퇴한 사용자입니다.");
        }

        return new CustomUserDetails(user);
    }
}
