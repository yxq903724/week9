import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../database.service";
@Component({
  selector: "app-actor",
  templateUrl: "./actor.component.html",
  styleUrls: ["./actor.component.css"],
})
export class ActorComponent implements OnInit {
  actorsDB: any[] = [];
  section = 1;
  fullName: string = "";
  bYear: number = 0;
  actorId: string = "";

  moviesDB=[];
  movieTitle='';
  movieYear=0;
  aYear=0;
  selectedActorId ='';
  selectedMovieId ='';


  constructor(private dbService: DatabaseService) {}
  //Get all Actors
  onGetActors() {
    this.dbService.getActors().subscribe((data: any[]) => {
      this.actorsDB = data;
    });
  }
  //Create a new Actor, POST request
  onSaveActor() {
    let obj = { name: this.fullName, bYear: this.bYear };
    this.dbService.createActor(obj).subscribe(result => {
      this.onGetActors();
    });
  }
  // Update an Actor
  onSelectUpdate(item) {
    this.fullName = item.name;
    this.bYear = item.bYear;
    this.actorId = item._id;
  }
  onUpdateActor() {
    let obj = { name: this.fullName, bYear: this.bYear };
    this.dbService.updateActor(this.actorId, obj).subscribe(result => {
      this.onGetActors();
    });
  }
  //Delete Actor
  onDeleteActor(item) {
    this.dbService.deleteActor(item._id).subscribe(result => {
      this.onGetActors();
    });
  }
  // This lifecycle callback function will be invoked with the component get initialized by Angular.
  ngOnInit() {
    this.onGetActors();
  }
  changeSection(sectionId) {
    this.section = sectionId;
    this.resetValues();
  }
  resetValues() {
    this.fullName = "";
    this.bYear = 0;
    this.actorId = "";
  }

  onGetMovies() {
    this.dbService.getMovies().subscribe((data: any[]) => {
      this.moviesDB = data;
    })
  }

  onSaveMovie() {
    let obj = { title: this.movieTitle, year: this.movieYear };
    this.dbService.createMovie(obj).subscribe(result => {
      // call onGetActors() to update the list of actors
      this.onGetMovies();
    })
  }

  onDeleteMovie(item) {
    this.dbService
      .deleteMovie(item._id)
      .subscribe(result => {
        this.onGetMovies();
      })
  }

  onDeleteMoviesByYear(aYear) {
    this.dbService
      .deleteMoviesByYear(aYear)
      .subscribe(result => {
        this.onGetMovies();
      })
  }

  onSelectActorToAdd(item) {
    this.selectedActorId = item._id;
  }

  onSelectMovie(item) {
    this.selectedMovieId = item._id;
  }

  onAddActorToMovie() {
    this.dbService
      .addActorToMovie(this.selectedMovieId, this.selectedActorId)
      .subscribe(result => {
        this.onGetMovies();
      })
  }
}