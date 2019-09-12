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
    admin: boolean;
}

export interface Message {
    sender: User;
    content: string;
    date: Date;
  }

export interface Participants {
    me: User;
    other: User;
    system: User;
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
            pictureUrl: 'https://i.imgur.com/y3cKSmP.png',
            coverUrl: 'https://i.imgur.com/xutC5nY.jpg',
            admin: false
        };
        const other = {
            name: faker.name.findName(),
            pictureUrl: 'https://i.imgur.com/y3cKSmP.png',
            coverUrl: 'https://i.imgur.com/xutC5nY.jpg',
            admin: false
        };
        const system = {
            name: 'Notification',
            pictureUrl: '',
            coverUrl: '',
            admin: true
        }

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
                other: other,
                system: system
            },
            messages: messages.sort((a, b) => {
                return a.date - b.date;
            })
        };

        return chat;
    }
}
