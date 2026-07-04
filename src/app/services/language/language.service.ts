import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  language: "en" | "hi";

  constructor(
    public translateService: TranslateService,
    private location: Location,
  ) {}

  initLanguage(){
    this.translateService.addLangs(["en", "hi"])
    this.translateService.setDefaultLang("en")
    this.translateService.use("en")
    this.location.go("en")
    this.language = "en"
  }

  changeLanguage(language){
    this.translateService.use(language)
    this.translateService.setDefaultLang(language)
    this.location.go(language)
    this.language = language
  }
}
