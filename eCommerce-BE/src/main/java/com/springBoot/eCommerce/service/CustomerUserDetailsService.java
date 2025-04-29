package com.springBoot.eCommerce.service;

import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.springBoot.eCommerce.model.Role;
import com.springBoot.eCommerce.model.User;
import com.springBoot.eCommerce.repository.UserRepository;

@Service
public class CustomerUserDetailsService implements UserDetailsService{
	
	@Autowired
	private UserRepository userRepository;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
		User user=userRepository.findByUsername(username)
				.orElseThrow(()-> new UsernameNotFoundException("User Not Found"+ username));
		return new org.springframework.security.core.userdetails.User(user.getUsername(),user.getPassword(),getAuthorities(user.getRole()));		
	}
	
	private Collection<? extends GrantedAuthority> getAuthorities(Role role){
		return List.of(new SimpleGrantedAuthority("ROLE_"+ role.name()));
	}

}
