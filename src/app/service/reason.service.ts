import { Injectable } from '@angular/core';
import { Reason } from '../model/reason';
import { ReasonWithImage } from '../model/reason-with-image';
import { LocalStorageService } from './local-storage.service';
import { HttpService } from './http.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReasonService {
  // Fallback reasons with placeholders - used if backend is unavailable
  private readonly fallbackReasons: Reason[] = [
    {
      id: 1,
      text: 'तुझं गोड हसणं 😍  I always like to see you smile. I know now you will think that i am the one who makes you cry ik. But i alwys thrive to see you smile. Keep smiling always',
      image: 'placeholder.svg',
    },
    {
      id: 2,
      text: 'तुझी काळजी करणारी स्वभाव 😊 तुझ्या काळजी घेणाऱ्या स्वभावामुळे मला असं वाटतं की मी कधीही एकटा नाही. तुझ्या प्रत्येक कृतीत मला तुझा प्रेम, समर्थन आणि काळजी दिसते. तू नेहमीच माझ्या आजुबाजुच्या गोष्टी जाणून घेतस.',
      image: 'placeholder.svg',
    },
    {
      id: 3,
      text: 'तुझं मनमिळाऊ असणं ❤️ तुझं मनमिळाऊ असणं म्हणजे एक मजेशीर गोष्ट! I always think ki tu sagla sambhalun ghshil tuzya hya quality mule. तुझ्या सोबत असताना tuza frank swabhaw',
      image: 'placeholder.svg',
    },
    {
      id: 4,
      text: 'तुझं हसणं आणि डोळ्यांतलं प्रेम 😍 तुझं हसणं आणि डोळ्यांतलं प्रेम म्हणजे जणू माझं सर्व काही आहे. ते हसू, आणि त्या डोळ्यांमध्ये असलेलं प्रेम माझ्या आयुष्याला एक नवा रंग देतं. हे असं प्रेम असणं म्हणजेच तुझी गोडी आणि तुझं सौंदर्यच!',
      image: 'placeholder.svg',
    },
    {
      id: 5,
      text: 'तुझी गोड आठवण 💕 तुझी प्रत्येक गोड आठवण म्हणजेच, माझ्या मनातील एक सुंदर गोड कथा आहे. त्या आठवणींमध्ये तू आणि मी एकमेकांसोबत असतो, हसत-खेळत, प्रत्येक क्षणाला आनंदी. आणि प्रत्येक आठवणीत, तुझं प्रेम आणि काळजी दिसतं.',
      image: 'placeholder.svg',
    },
    {
      id: 6,
      text: 'तुझ्या स्पर्शातली ऊब ❤️ तुझ्या स्पर्शात असलेली ऊब म्हणजे एक गोड जादू आहे. ते स्पर्श जणू माझ्या हृदयाला दिलासा देतो आणि माझ्या शरीरात उब वाढवतो. तुझ्या स्पर्शामुळे मी कमी असतो, आणि प्रत्येक वेळी तुझ्याजवळ असताना, तो ऊबचं प्रेम अनुभवतो',
      image: 'placeholder.svg',
    },
    {
      id: 7,
      text: 'आपल्या आठवणी अमूल्य आहेत 💖 आपल्या गोड आणि सुंदर आठवणी म्हणजे आपल्या प्रेमाची खूप मोठी भेट आहे. त्या लहान-लहान आठवणी जणू एकाच मनामध्ये रेकॉर्ड झालेल्या गोड गाण्यांसारख्या आहेत, ज्या कधीच आपल्याला विसरणार नाहीत. ते सगळं आठवणीतलं प्रेम अजूनही माझ्या हृदयात जिवंत आहे, आणि त्या प्रत्येक क्षणांना मी सादर करतं. 💞',
      image: 'placeholder.svg',
    },
    {
      id: 8,
      text: "तू माझ्यासाठी सगळं काही आहेस! 💖 Happy Valentine Day - I know we dont celebrate valentines but i had nothing else to show you my LOVE. By looking at the current scenario, I don't know how we end, but I definitely dreamt about our future. I LOVE YOU.",
      image: 'placeholder.svg',
    },
    {
      id: 9,
      text: 'आणि बरेच काही... 💝 The list of reasons why I love you is endless. These are just a few of the countless things that make you special to me. Every day I discover new reasons to love you more. You are my everything! ❤️',
      image: 'placeholder.svg',
    },
  ];

  private reasons: Reason[] = this.fallbackReasons;

  constructor(
    private localStorageService: LocalStorageService,
    private httpService: HttpService,
  ) {}

  getReason(id: number): Reason | undefined {
    return this.reasons.find((reason) => reason.id === id);
  }

  getAllReasons(): Reason[] {
    return this.reasons;
  }

  /**
   * Fetch reasons from backend API
   * This will update the internal reasons array
   */
  fetchReasonsFromBackend(): Observable<Reason[]> {
    return this.httpService.getReasons().pipe(
      map((backendReasons: ReasonWithImage[]) => {
        // Convert backend format to internal Reason format
        const convertedReasons: Reason[] = backendReasons.map((r) => ({
          id: r.id,
          text: r.text,
          image: r.imageUrl,
        }));
        // Update internal reasons
        this.reasons = convertedReasons;
        return convertedReasons;
      }),
      catchError((error) => {
        console.error('Failed to fetch reasons from backend:', error);
        // Return fallback reasons on error
        this.reasons = this.fallbackReasons;
        return of(this.fallbackReasons);
      }),
    );
  }

  /**
   * Fetch a single reason from backend by ID
   */
  fetchReasonById(id: number): Observable<Reason | undefined> {
    return this.httpService.getReasonById(id).pipe(
      map((backendReason: ReasonWithImage) => ({
        id: backendReason.id,
        text: backendReason.text,
        image: backendReason.imageUrl,
      })),
      catchError((error) => {
        console.error(`Failed to fetch reason ${id} from backend:`, error);
        // Return reason from local fallback on error
        return of(this.fallbackReasons.find((r) => r.id === id));
      }),
    );
  }

  isUnlocked(reason: Reason): boolean {
    return this.localStorageService.isBoxUnlocked(reason.id);
  }

  getUnlockTime(reason: Reason): number | null {
    return this.localStorageService.getNextUnlockTime(reason.id);
  }

  getRemainingTime(reason: Reason): number {
    return this.localStorageService.getRemainingTime(reason.id);
  }

  markBoxAsOpened(reasonId: number): void {
    this.localStorageService.setBoxOpenedTime(reasonId);
  }

  formatCountdown(milliseconds: number): string {
    if (milliseconds === Infinity) {
      return 'Locked';
    }

    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }
}
