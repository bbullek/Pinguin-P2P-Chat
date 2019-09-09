/*
 * Generate fake messaging data between two or more users to populate
 * the app with dummy text.
 */

import { Injectable } from '@angular/core';

const faker = require('faker');

export interface User {
    name: string;
    pictureUrl: string;
    coverUrl: string;
}

export interface Message {
    sender: User;
    content: string;
    date: Date;
  }

export interface Participants {
    me: User;
    other: User;
}

export interface Chat {
    participants: Participants;
    messages: Array<Message>;
}

@Injectable()
export class ChatroomService {

    getChat(): Chat {
        const me = {
            name: 'Me',
            pictureUrl: 'https://unsplash.it/100/100?image=837',
            coverUrl: ''
        };
        const other = {
            name: faker.name.findName(),
            pictureUrl: 'https://unsplash.it/100/100?image=823',
            coverUrl: 'https://i.imgur.com/xutC5nY.jpg',
        };

        const messages = [];
        for (let i = 0; i < 4; i++) {
            const sender = faker.random.boolean() ? me : other;
            const content = faker.lorem.sentence();
            const date = faker.date.recent();

            messages.push({
                sender: sender,
                content: content,
                date: date
            });
        }

        const chat = {
            participants: {
                me: me,
                other: other
            },
            messages: messages.sort((a, b) => {
                return a.date - b.date;
            })
        };

        return chat;
    }
}
