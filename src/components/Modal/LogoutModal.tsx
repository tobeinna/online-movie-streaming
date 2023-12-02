import { Modal } from "antd";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";

interface ILogoutModalProps {
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
}

const LogoutModal: React.FC<ILogoutModalProps> = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const { logOut } = useAuth();
  return (
    <Modal
      open={open}
      onOk={() => {
        logOut();
        navigate("/auth/login");
      }}
      okButtonProps={{ className: "logout-modal-ok text-slate-100 bg-[#dd2b0e]" }}
      cancelButtonProps={{ className: "logout-modal-cancel" }}
      okText="Log out"
      onCancel={() => setOpen(false)}
    >
      <p>Are you sure to log out of this account?</p>
    </Modal>
  );
};

export default LogoutModal;
