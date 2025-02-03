import { Injectable } from '@angular/core';
import { Reason } from '../model/reason';

@Injectable({
  providedIn: 'root',
})
export class ReasonService {
  private reasons: Reason[] = [
    {
      id: 1,
      text: 'तुझं गोड हसणं 😍  I always like to see you smile. I know now you will think that i am the one who makes you cry ik. But i alwys thrive to see you smile. Keep smiling always',
      image: '2.jpg',
      unlockDate: new Date('2025-02-07'),
    },
    {
      id: 2,
      text: 'तुझी काळजी करणारी स्वभाव 😊 तुझ्या काळजी घेणाऱ्या स्वभावामुळे मला असं वाटतं की मी कधीही एकटा नाही. तुझ्या प्रत्येक कृतीत मला तुझा प्रेम, समर्थन आणि काळजी दिसते. तू नेहमीच माझ्या आजुबाजुच्या गोष्टी जाणून घेतस.',
      image: '8.jpg',
      unlockDate: new Date('2025-02-08'),
    },
    {
      id: 3,
      text: 'तुझं मनमिळाऊ असणं ❤️ तुझं मनमिळाऊ असणं म्हणजे एक मजेशीर गोष्ट! I always think ki tu sagla sambhalun ghshil tuzya hya quality mule. तुझ्या सोबत असताना tuza frank swabhaw',
      image: '6.jpg',
      unlockDate: new Date('2025-02-09'),
    },
    {
      id: 4,
      text: 'तुझं हसणं आणि डोळ्यांतलं प्रेम 😍 तुझं हसणं आणि डोळ्यांतलं प्रेम म्हणजे जणू माझं सर्व काही आहे. ते हसू, आणि त्या डोळ्यांमध्ये असलेलं प्रेम माझ्या आयुष्याला एक नवा रंग देतं. हे असं प्रेम असणं म्हणजेच तुझी गोडी आणि तुझं सौंदर्यच!',
      image: '10.jpg',
      unlockDate: new Date('2025-02-10'),
    },
    {
      id: 5,
      text: 'तुझी गोड आठवण 💕 तुझी प्रत्येक गोड आठवण म्हणजेच, माझ्या मनातील एक सुंदर गोड कथा आहे. त्या आठवणींमध्ये तू आणि मी एकमेकांसोबत असतो, हसत-खेळत, प्रत्येक क्षणाला आनंदी. आणि प्रत्येक आठवणीत, तुझं प्रेम आणि काळजी दिसतं.',
      image: '1.jpg',
      unlockDate: new Date('2025-02-11'),
    },
    {
      id: 6,
      text: 'तुझ्या स्पर्शातली ऊब ❤️ तुझ्या स्पर्शात असलेली ऊब म्हणजे एक गोड जादू आहे. ते स्पर्श जणू माझ्या हृदयाला दिलासा देतो आणि माझ्या शरीरात उब वाढवतो. तुझ्या स्पर्शामुळे मी कमी असतो, आणि प्रत्येक वेळी तुझ्याजवळ असताना, तो ऊबचं प्रेम अनुभवतो',
      image: '5.jpg',
      unlockDate: new Date('2025-02-12'),
    },
    {
      id: 7,
      text: 'आपल्या आठवणी अमूल्य आहेत 💖 आपल्या गोड आणि सुंदर आठवणी म्हणजे आपल्या प्रेमाची खूप मोठी भेट आहे. त्या लहान-लहान आठवणी जणू एकाच मनामध्ये रेकॉर्ड झालेल्या गोड गाण्यांसारख्या आहेत, ज्या कधीच आपल्याला विसरणार नाहीत. ते सगळं आठवणीतलं प्रेम अजूनही माझ्या हृदयात जिवंत आहे, आणि त्या प्रत्येक क्षणांना मी सादर करतं. 💞',
      image: '4.gif',
      unlockDate: new Date('2025-02-13'),
    },
    {
      id: 8,
      text: "तू माझ्यासाठी सगळं काही आहेस! 💖 Happy Valentine Day - I know we dont celebrate valentines but i had nothing else to show you my LOVE. By looking at the current scenario, I don't know how we end, but I definitely dreamt about our future. I LOVE YOU.",
      image: '11.jpg',
      unlockDate: new Date('2025-02-14'),
    },
  ];

  getReason(id: number): Reason | undefined {
    return this.reasons.find((reason) => reason.id === id);
  }

  getAllReasons(): Reason[] {
    return this.reasons;
  }

  isUnlocked(reason: Reason): boolean {
    return new Date() >= reason.unlockDate;
  }
}
