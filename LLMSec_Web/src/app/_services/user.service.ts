import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/register`, user);
    }

    submitprompt(id: number, userprompt: string) {
        return this.http.post<{message:string, response:string}>(`${environment.apiUrl}/submitprompt`, { id, userprompt });
    }

    submitsettings(id: number, settings: any) {
        return this.http.post<{message:string}>(`${environment.apiUrl}/submitsettings`, { id, settings });
    }    
}