package com.cos.chatapp;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@RestController // 데이터 리턴 서버
public class ChatController {

    private final ChatRepository chatRepository;

    // 클라이언트가 서버로 요청
    // 귓속말 할 때 사용하면 된다.
    @CrossOrigin
    @GetMapping(value = "/sender/{sender}/receiver/{receiver}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Chat> getMessage(@PathVariable String sender,
                                 @PathVariable String receiver) {

        // MediaType.TEXT_EVENT_STREAM_VALUE -> SSE 프로토콜, 데이터를 흘려보낸다.

        // 서버는 받아서 db에 저장
        return chatRepository.mFindBySender(sender, receiver)
                .subscribeOn(Schedulers.boundedElastic());
    }

    // 일단 채팅 내역 모두 다 받아야 한다.
    @CrossOrigin
    @GetMapping(value = "/chat/roomNum/{roomNum}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Chat> findByRoomNum(@PathVariable Integer roomNum) {
        return chatRepository.mFindByRoomNum(roomNum)
                .subscribeOn(Schedulers.boundedElastic());
    }

    @CrossOrigin
    @PostMapping("/chat")
    public Mono<Chat> setMessage(@RequestBody Chat chat) {

        chat.setCreatedAt(LocalDateTime.now());
        return chatRepository.save(chat);
        // 세이브한 데이터가 잘 들어왔는지 확인하기 위해 Mono 로 반환 (데이터 하나 넣을 때)
    }

}
