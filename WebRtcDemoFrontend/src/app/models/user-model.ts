import BasicProfile = gapi.auth2.BasicProfile;

export class UserModel {
  dbId: number = 0;
  googleId: string = '';
  fullName: string = '';
  email: string = '';
  avatarUrl: string = '';

  constructor(profile: BasicProfile | undefined = undefined) {
    this.fillData(profile);
  }

  fillData(profile: BasicProfile | undefined): void {
    if (!profile) return;
    this.googleId = profile.getId();
    this.fullName = profile.getName();
    this.email = profile.getEmail();
    this.avatarUrl = profile.getImageUrl();
    this.dbId = 0;
  }

  assign(user: UserModel) {
   if (!user) return;
   Object.assign(this, user);
  }
}
