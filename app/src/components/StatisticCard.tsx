import * as React from 'react';
import { useCountUp } from 'react-countup';
import { Row, Col, Card } from 'react-bootstrap';

const HighlightCard: React.FC = ({children}) => {
  return (
    <Col xl={3} md={6} className="mb-4">
      <Card className="border-left-primary shadow h-100 py-2">
        <Card.Body>
          <Row>
            {children}
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
}

interface StatisticCardProps {
  title: string
  value: number
  icon: string
}
export const StatisticCard: React.FC<StatisticCardProps> = ({title, value, icon}) => {
  const { countUp, update } = useCountUp({ end: value, separator: ','});
  React.useEffect(() => update(value), [value, update])
  return (
    <HighlightCard>
      <Col className="mr-2">
        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{title}</div>
        <div className="h5 mb-0 font-weight-bold text-gray-800">{countUp}</div>
      </Col>
      <Col xs='auto'>
        <i className={`fas fa-${icon} fa-2x text-gray-300`}></i>
      </Col>
    </HighlightCard>
  );
}

interface ProgressCardProps {
  title: string
  progress: number
  icon: string
}
export const ProgressCard: React.FC<ProgressCardProps> = ({title, progress, icon}) => {
  const progressPercentage = Math.round(progress * 100);
  const { countUp, update } = useCountUp({ end: progressPercentage, separator: ','});
  React.useEffect(() => update(progressPercentage), [progressPercentage, update])
  return (
    <HighlightCard>
      <Col className="mr-2">
        <div className="text-xs font-weight-bold text-info text-uppercase mb-1">{title}</div>
        <Row className="no-gutters align-items-center">
          <Col xs='auto'>
            <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{countUp}%</div>
          </Col>
          <Col>
            <div className="progress progress-sm mr-2">
              <div className="progress-bar bg-primary" role="progressbar" style={{width: `${countUp}%`}}></div>
            </div>
          </Col>
        </Row>
      </Col>
      <Col xs='auto'>
        <i className={`fas fa-${icon} fa-2x text-gray-300`}></i>
      </Col>
    </HighlightCard>
  );
}
