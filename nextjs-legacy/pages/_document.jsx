// This file provides the overall layout of the site via the `render` method.

import Document, { Html, Head, Main, NextScript } from 'next/document';
import newrelic from 'newrelic';

import winston from 'winston';

const logger = winston.createLogger();

// In order to inject the browser agent we need to perform an asynchronous
// operation. To do that, we need to extend the `Document` object as
// described in
// https://nextjs.org/docs/pages/building-your-application/routing/custom-document#customizing-renderpage
class RootDocument extends Document {
	static async getInitialProps(context) {
		const initialProps = await Document.getInitialProps(context);

		if (newrelic?.agent?.collector?.isConnected() === false) {
			await new Promise((resolve) => {
				newrelic.agent.on('connected', resolve);
			});
		}

		const browserTimingHeader = newrelic.getBrowserTimingHeader({
			hasToRemoveScriptWrapper: true,
			allowTransactionlessInjection: true,
		});

		console.log(process.env.NEW_RELIC_LICENSE_KEY, 'NEW_RELIC_LICENSE_KEY');

		logger.info('NextJs New Relic redirecting to a page', {
			application: 'NextJs NewRelic app logging',
			test: 'Testing logging with Winston',
			pathname: context?.pathname,
		});

		return {
			...initialProps,
			browserTimingHeader,
		};
	}

	render() {
		return (
			<Html>
				<Head>
					<script
						type='text/javascript'
						// The body of the script element comes from the async evaluation
						// of `getInitialProps`. We use the special
						// `dangerouslySetInnerHTML` to provide that element body. Since
						// it requires an object with an `__html` property, we pass in an
						// object literal.
						dangerouslySetInnerHTML={{ __html: this.props.browserTimingHeader }}
					/>
					<link rel='stylesheet' href='/style.css' />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default RootDocument;
