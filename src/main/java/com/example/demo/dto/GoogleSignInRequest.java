package com.example.demo.dto;

public class GoogleSignInRequest {

    private String token;
    private String email;
    private String name;
    private String picture;

    public GoogleSignInRequest() {
    }

    public GoogleSignInRequest(String token, String email, String name, String picture) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.picture = picture;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }
}
