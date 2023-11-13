import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent, UniForOf } from "./app.component";

@NgModule({
	imports: [BrowserModule, FormsModule],
	declarations: [AppComponent, UniForOf],
	bootstrap: [AppComponent],
})
export class AppModule {}
