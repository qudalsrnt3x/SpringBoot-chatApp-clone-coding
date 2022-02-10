package com.cos.chatapp;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "chat")
public class Chat {

    @Id
    private String id; // 기본 몽고DB가 id 만들어준다.

    private String msg;

    private String sender;  // 보내는 사람

    private String receiver;    // 받는 사람(귓속말할 때 필요)

    private Integer roomNum;    // 방 번호

    private LocalDateTime createdAt;
}
