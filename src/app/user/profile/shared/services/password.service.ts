import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private passwordToVerify: string

  constructor() { }

  checkStrength(password: string) {
    let strength = 0
    const passwordLen = password.length

    if(passwordLen === 0) return 0

    const symbolsRegex = new RegExp('[#$-/:-?{-~!"^_@`\\[\]','g')
    const lowerLetterRegex = new RegExp('[a-z]+')
    const upperLetterRegex = new RegExp('[A-Z]+')
    const numberRegex = new RegExp('[0-9]+')

    const specialSymbols =symbolsRegex.test(password)
    const lowerLetters =lowerLetterRegex.test(password)
    const upperLetters =upperLetterRegex.test(password)
    const numbers =numberRegex.test(password)

    const flags = [specialSymbols, lowerLetters, upperLetters, numbers]

    let passedMatches = 0
    for(const flag of flags){
      passedMatches += flag ? 1 : 0
    }

    strength += 2 * passwordLen + (passwordLen >= 10 ? 1 : 0)
    strength += passedMatches * 10

    //for short passwords
    strength = passwordLen <= 8 ? Math.min(strength, 10) : strength

    // normalization of password strength from 0 to 40
    strength = passedMatches === 1 ? Math.min(strength, 10) : strength;
    strength = passedMatches === 2 ? Math.min(strength, 20) : strength;
    strength = passedMatches === 3 ? Math.min(strength, 30) : strength;
    strength = passedMatches === 4 ? Math.min(strength, 40) : strength;

    return strength
  }
}
