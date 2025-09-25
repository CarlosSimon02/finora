import { IAuthClientRepository } from "@/core/interfaces/IAuthClientRepository";
import {
  AuthResponseDto,
  LoginWithEmailCredentialsDto,
  SignUpCredentialsDto,
} from "@/core/schemas/authSchema";
import { clientAuth } from "@/infrastructure/firebase/firebaseClient";
import { debugLog } from "@/utils";
import {
  applyActionCode as applyActionCodeFn,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification as sendEmailVerificationFn,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export class AuthClientRepository implements IAuthClientRepository {
  constructor() {}

  async signUpWithEmail(
    credentials: SignUpCredentialsDto
  ): Promise<AuthResponseDto> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        clientAuth,
        credentials.email,
        credentials.password
      );
      const idToken = await userCredential.user.getIdToken();
      return {
        id: userCredential.user.uid,
        email: userCredential.user.email!,
        idToken,
        refreshToken: userCredential.user.refreshToken,
      };
    } catch (err) {
      debugLog("AuthClientRepository", "Failed to sign up with email", err);
      throw err;
    }
  }

  async logInWithEmail(
    credentials: LoginWithEmailCredentialsDto
  ): Promise<AuthResponseDto> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        clientAuth,
        credentials.email,
        credentials.password
      );
      const idToken = await userCredential.user.getIdToken();
      return {
        id: userCredential.user.uid,
        email: userCredential.user.email!,
        idToken,
        refreshToken: userCredential.user.refreshToken,
      };
    } catch (err) {
      debugLog("AuthClientRepository", "Failed to log in with email", err);
      throw err;
    }
  }

  async signInWithGoogle(): Promise<AuthResponseDto> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(clientAuth, provider);
      const idToken = await userCredential.user.getIdToken();
      return {
        id: userCredential.user.uid,
        email: userCredential.user.email!,
        idToken,
        refreshToken: userCredential.user.refreshToken,
      };
    } catch (err) {
      debugLog("AuthClientRepository", "Failed to sign in with Google", err);
      throw err;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(clientAuth, email);
    } catch (err) {
      debugLog("AuthClientRepository", "Failed to reset password", err);
      throw err;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(clientAuth);
    } catch (err) {
      debugLog("AuthClientRepository", "Failed to sign out", err);
      throw err;
    }
  }

  async getIdToken(): Promise<string> {
    try {
      const user = clientAuth.currentUser;
      if (!user) throw new Error("No user is signed in.");
      return await user.getIdToken();
    } catch (err) {
      debugLog("AuthClientRepository", "Failed to get ID token", err);
      throw err;
    }
  }

  async sendEmailVerification(): Promise<void> {
    try {
      const user = clientAuth.currentUser;
      if (!user) throw new Error("No user is signed in.");
      await sendEmailVerificationFn(user);
    } catch (err) {
      debugLog(
        "AuthClientRepository",
        "Failed to send email verification",
        err
      );
      throw err;
    }
  }

  async applyEmailVerification(oobCode: string): Promise<void> {
    try {
      await applyActionCodeFn(clientAuth, oobCode);
    } catch (err) {
      debugLog(
        "AuthClientRepository",
        "Failed to apply email verification",
        err
      );
      throw err;
    }
  }
}
