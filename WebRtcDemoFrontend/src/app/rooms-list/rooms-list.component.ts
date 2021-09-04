import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {CreateNewRoomDialogComponent} from "./create-new-room-dialog/create-new-room-dialog.component";
import {RoomModel} from "../models/room-model";
import {RoomService} from "../services/room.service";
import {AuthGuard} from "../auth-guard.service";

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.scss']
})
export class RoomsListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'description', 'createdBy', 'createdAt', "members"];
  dataSource: RoomModel[] = [];
  selectedRowId?: number;

  constructor(private readonly router: Router,
              private readonly roomService: RoomService,
              private readonly authGuard: AuthGuard,
              public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    const sub = this.roomService.getAll().subscribe(rooms => {
      this.dataSource = rooms;
      sub.unsubscribe();
    }, () => {
      sub.unsubscribe();
    });
  }

  selectRow(row: RoomModel): void {
    this.selectedRowId = row.id;
  }

  openRoom(rowId: number | undefined): void {
    if (!rowId) return;
    this.router.navigate(['room', rowId])
  }

  openCreateNewRoomDialog(): void {
    const dialogRef = this.dialog.open(CreateNewRoomDialogComponent, {
      width: '500px',
      height: '350px',
      data: { description: '' }
    });

    dialogRef.afterClosed().subscribe(description => {
      if (!description) return;
      const user = this.authGuard.userView;

      const newRoom = {
        createdBy: user.fullName,
        userId: user.dbId,
        description: description,
      } as RoomModel;

      const sub = this.roomService.create(newRoom).subscribe(room => {
        this.dataSource.push(room);
        this.dataSource = this.dataSource.slice();
        sub.unsubscribe();
        this.openRoom(room.id);
      }, () => {
        sub.unsubscribe();
      });
    });
  }
}
