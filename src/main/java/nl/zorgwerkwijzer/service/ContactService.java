package nl.zorgwerkwijzer.service;

import nl.zorgwerkwijzer.dto.ContactRequestDto;

public interface ContactService {
    void sendContactMessage(ContactRequestDto request);
}
