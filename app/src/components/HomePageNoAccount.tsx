import React from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';

import * as styles from './Header.module.scss';

const Header: React.FC = () => {
  return (
    <Container fluid className={styles.header}>
        <h3 className={styles.title}>Home</h3>

        <div className={styles.breadcrumb}>
          <a href="" className={styles.link}>Dashboards</a>
          <span className={styles.separator}></span>
          <a href="" className={styles.link}>Home</a>
        </div>
    </Container>
  );
}

const CustomCard: React.FC = () => {
  return (
    <div className="kt-portlet kt-portlet--height-fluid-half">
	<div className="kt-portlet__head kt-portlet__head--noborder">
		<div className="kt-portlet__head-label">
			<h3 className="kt-portlet__head-title">Author Sales</h3>
		</div>
		<div className="kt-portlet__head-toolbar">
			<div className="kt-portlet__head-toolbar-wrapper">
				<div className="dropdown dropdown-inline">
					<button type="button" className="btn btn-clean btn-sm btn-icon btn-icon-md" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<i className="flaticon-more-1"></i>
					</button>
				</div>
			</div>
		</div>
	</div>
	<div className="kt-portlet__body kt-portlet__body--fluid">
		<div className="kt-widget-19">
			<div className="kt-widget-19__title">
				<div className="kt-widget-19__label"><small>$</small>64M</div>
				<img className="kt-widget-19__bg" src="/keen/themes/keen/theme/demo2/dist/assets/media/misc/iconbox_bg.png" alt="bg"/>
			</div>
			<div className="kt-widget-19__data">
				<div className="kt-widget-19__chart">
					<div className="kt-widget-19__bar"><div className="kt-widget-19__bar-45" data-toggle="kt-tooltip" data-skin="brand" data-placement="top" title="" data-original-title="45"></div></div>
					<div className="kt-widget-19__bar"><div className="kt-widget-19__bar-95" data-toggle="kt-tooltip" data-skin="brand" data-placement="top" title="" data-original-title="95"></div></div>
					<div className="kt-widget-19__bar"><div className="kt-widget-19__bar-63" data-toggle="kt-tooltip" data-skin="brand" data-placement="top" title="" data-original-title="63"></div></div>
					<div className="kt-widget-19__bar"><div className="kt-widget-19__bar-11" data-toggle="kt-tooltip" data-skin="brand" data-placement="top" title="" data-original-title="11"></div></div>
					<div className="kt-widget-19__bar"><div className="kt-widget-19__bar-46" data-toggle="kt-tooltip" data-skin="brand" data-placement="top" title="" data-original-title="46"></div></div>
					<div className="kt-widget-19__bar"><div className="kt-widget-19__bar-88" data-toggle="kt-tooltip" data-skin="brand" data-placement="top" title="" data-original-title="88"></div></div>
				</div>
			</div>
		</div>
	</div>
</div>
  );
}

const HomePageNoAccount: React.FC = () => {
  return (
    <>
      <Header/>
      <Container>
        <CustomCard />
        <Row>
          <Col md={3}>
            <Card>
              <p>{'It doesn\'t look like you\'re logged in yet.'}</p>
              <p><Button>Log in</Button></p>
              <p><Button>Register</Button></p>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}



export default HomePageNoAccount;
