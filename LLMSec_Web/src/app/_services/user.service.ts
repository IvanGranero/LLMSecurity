import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../_models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/register`, user);
    }

    submitprompt(id: string, level: string, userprompt: string) {
        return this.http.post<{message:string, response:string}>(`${environment.apiUrl}/submitprompt`, { id, level, userprompt });
    }

    submitsettings(id: string, settings: any) {
        return this.http.post<{message:string}>(`${environment.apiUrl}/submitsettings`, { id, settings });
    }

    submitflag(id: string, level: string, flag: string) {
        return this.http.post<{message:string, response:string}>(`${environment.apiUrl}/submitflag`, { id, level, flag });
    }

    getScoreboard(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/scoreboard`);
    }    
}