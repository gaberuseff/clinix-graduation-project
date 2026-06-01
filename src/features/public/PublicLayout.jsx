import {Header} from "../../components/simple-header";
import {Outlet} from "react-router-dom";

function PublicLayout() {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      {/* <Footer /> */}
    </>
  );
}

export default PublicLayout;
