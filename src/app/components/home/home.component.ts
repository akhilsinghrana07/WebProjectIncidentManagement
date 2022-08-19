import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { FormBuilder,FormGroup } from '@angular/forms';
import { HomeModel } from './home.component.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;
  
  formValue !: FormGroup;
  homeModelObj : HomeModel = new HomeModel();
  showAdd !: boolean;
  showUpdate !:boolean;
  incidentData !:any;

  constructor(
    private usersService: UsersService,
    private formbuilder: FormBuilder,
    private api : ApiService
    ) {}
  
    
  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      date : [''],
      requestDetails  : [''],
      priority : [''],
      status : ['']

    })
    this.getAllIncident();
  }

  clickAdd(){
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }
  postHomeDetails(){
    this.homeModelObj.date = this.formValue.value.date;
    this.homeModelObj.requestDetails = this.formValue.value.requestDetails;
    this.homeModelObj.priority = this.formValue.value.priority;
    this.homeModelObj.status = this.formValue.value.status;

    this.api.postIncident(this.homeModelObj)
    .subscribe(res=>{
      console.log(res);
      alert("Incident added successfully")
      let ref = document.getElementById('cancel')
      ref?.click();
      this.formValue.reset();
      this.api.getIncident();
    })
  }

  getAllIncident(){
    this.api.getIncident()
    .subscribe(res=>{
      this.incidentData = res;
    })
  }

  deleteIncidents(row : any){
    this.api.deleteIncident(row.id)
    .subscribe(res=>{
      alert("Incident Deleted");
      this.getAllIncident();
    })
  }
  onEdit(row:any){
    this.showAdd =false;
    this.showUpdate=true;
    this.homeModelObj.id= row.id
    this.formValue.controls['date'].setValue(row.date);
    this.formValue.controls['requestDetails'].setValue(row.requestDetails);
    this.formValue.controls['priority'].setValue(row.priority);
    this.formValue.controls['status'].setValue(row.status);
  }

  updateIncidents(){
    this.homeModelObj.date = this.formValue.value.date;
    this.homeModelObj.requestDetails = this.formValue.value.requestDetails;
    this.homeModelObj.priority = this.formValue.value.priority;
    this.homeModelObj.status = this.formValue.value.status;

    this.api.updateIncident(this.homeModelObj,this.homeModelObj.id)
    .subscribe(res=>{
      alert("Updated Succesfully");
      let ref = document.getElementById('cancel')
      ref?.click();
      this.formValue.reset();
      this.api.getIncident();
    })
  }
  
}
