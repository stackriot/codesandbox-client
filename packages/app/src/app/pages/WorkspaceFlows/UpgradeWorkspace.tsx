import React, { useEffect, useState } from 'react';
import { WorkspaceSetup } from 'app/components/WorkspaceSetup';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { Redirect, useHistory } from 'react-router-dom';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { WorkspaceSetupStep } from 'app/components/WorkspaceSetup/types';
import { useActions, useAppState } from 'app/overmind';
import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';

export const UpgradeWorkspace = () => {
  const { hasLogIn } = useAppState();
  const { isAdmin } = useWorkspaceAuthorization();
  const { isUbbPro, isPaddle } = useWorkspaceSubscription();
  const { getQueryParam } = useURLSearchParams();
  const workspaceId = getQueryParam('workspace');
  const history = useHistory();

  const {
    dashboard: { dashboardMounted },
  } = useActions();

  useEffect(() => {
    dashboardMounted();
  }, [dashboardMounted]);

  const [steps] = useState(() => {
    // Ensure this is run only once
    const initialSteps: WorkspaceSetupStep[] = [
      'plans',
      'addons',
      'plan-options',
      'finalize',
    ];

    if (!workspaceId) {
      initialSteps.unshift('select-workspace');
    }

    return initialSteps;
  });

  if (!hasLogIn) {
    return (
      <Redirect to={signInPageUrl(`${location.pathname}${location.search}`)} />
    );
  }

  if (workspaceId && (isAdmin === false || isUbbPro || isPaddle)) {
    // Page was accessed by a non-admin or for pro ubb workspaces or paddle
    return <Redirect to={dashboardUrls.recent(workspaceId)} />;
  }

  return (
    <WorkspaceSetup
      steps={steps}
      onComplete={fullReload => {
        if (fullReload) {
          window.location.href = dashboardUrls.recent(workspaceId);
        } else {
          history.push(dashboardUrls.recent(workspaceId));
        }
      }}
      onDismiss={() => {
        history.push(dashboardUrls.recent(workspaceId));
      }}
    />
  );
};