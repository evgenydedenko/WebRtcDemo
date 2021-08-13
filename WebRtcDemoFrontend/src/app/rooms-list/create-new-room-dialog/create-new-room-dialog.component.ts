import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-create-new-room-dialog',
  templateUrl: './create-new-room-dialog.component.html',
  styleUrls: ['./create-new-room-dialog.component.scss']
})
export class CreateNewRoomDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CreateNewRoomDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
