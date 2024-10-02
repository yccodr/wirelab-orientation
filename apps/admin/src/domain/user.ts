interface User {
  id: string;
  name: string;
  email: string;
  tags?: string[];
  sshPublicKey?: string;
  sshPrivateKey?: string;
  wireguardConfig?: string;
}

interface UserForm {
  name: string;
  email: string;
  tags?: string[];
  vm: {
    name: string;
    ip: string;
  };
  sshPublicKey?: string;
  sshPrivateKey?: string;
  wireguardConfig?: string;
}

export type { User, UserForm };
