import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};
@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  constructor(private http: HttpClient) {}


  getActors() {
    return this.http.get("/allactors");
  }
  getActor(id: string) {
    let url = "/actors/" + id;
    return this.http.get(url);
  }
  createActor(data) {
    return this.http.post("/actors", data, httpOptions);
  }
  updateActor(id, data) {
    let url = "/actors/" + id;
    return this.http.put(url, data, httpOptions);
  }
  deleteActor(id) {
    let url = "/actors/" + id;
    return this.http.delete(url, httpOptions);
  }

  createMovie(data) {
    return this.http.post('/movies', data, httpOptions);
  }

  getMovies() {
    return this.http.get('/movies');
  }

  deleteMovie(id) {
    let url = '/movies/' + id;
    return this.http.delete(url, httpOptions);
  }

  deleteMoviesByYear(aYear) {
    let obj = { year1: aYear, year2: 0 };
    return this.http.request('delete', '/movies', { body: obj });
  }

  addActorToMovie(movieId, actorId) {
    let url = '/movies/' + movieId + '/actors';
    console.log(url);
    let obj = { id: actorId }
    return this.http.post(url, obj, httpOptions);
  }
  
}