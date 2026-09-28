package com.edubridge.app;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.SslErrorHandler;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;

import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class MainActivity extends AppCompatActivity {

    public static final String EDUBRIDGE_PRODUCTION_URL = BuildConfig.EDUBRIDGE_PRODUCTION_URL;
    private static final String PREF_NAME = "EduBridgePrefs";
    private static final String KEY_SERVER_URL = "server_url";

    private WebView webView;
    private SwipeRefreshLayout swipeRefresh;
    private ProgressBar progressBar;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Dark immersion window styling matching EduBridge theme
        getWindow().setStatusBarColor(Color.parseColor("#030712"));
        getWindow().setNavigationBarColor(Color.parseColor("#030712"));

        FrameLayout rootLayout = new FrameLayout(this);
        rootLayout.setBackgroundColor(Color.parseColor("#030712"));

        swipeRefresh = new SwipeRefreshLayout(this);
        swipeRefresh.setColorSchemeColors(Color.parseColor("#38bdf8"), Color.parseColor("#6366f1"));
        swipeRefresh.setProgressBackgroundColorSchemeColor(Color.parseColor("#0f172a"));

        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#030712"));

        swipeRefresh.addView(webView);
        rootLayout.addView(swipeRefresh);

        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progressBar.setMax(100);
        progressBar.setProgress(0);
        progressBar.setVisibility(View.GONE);
        rootLayout.addView(progressBar, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, 8
        ));

        setContentView(rootLayout);

        // Configure persistent cookies for authenticated sessions
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webView, true);

        // Configure WebSettings for high performance & Next.js App Router compatibility
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setUserAgentString(settings.getUserAgentString() + " EduBridgeMobileApp/1.0.1");

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    progressBar.setVisibility(View.VISIBLE);
                    progressBar.setProgress(newProgress);
                } else {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                    CookieManager.getInstance().flush();
                }
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String scheme = uri.getScheme();
                if (scheme == null) return false;

                // Handle external protocols (tel, mailto, etc.)
                if (!scheme.equalsIgnoreCase("http") && !scheme.equalsIgnoreCase("https")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                        startActivity(intent);
                    } catch (Exception ignored) {
                    }
                    return true;
                }

                // If URL host matches our target or is a relative redirect, handle in WebView
                String host = uri.getHost();
                String targetHost = Uri.parse(getTargetUrl()).getHost();
                if (host != null && targetHost != null && !host.equalsIgnoreCase(targetHost)) {
                    // Non-application external links open safely in system browser
                    try {
                        Intent browserIntent = new Intent(Intent.ACTION_VIEW, uri);
                        startActivity(browserIntent);
                        return true;
                    } catch (Exception ignored) {
                    }
                }

                return false;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    String errorHtml = "<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                            "<style>" +
                            "body{background:#030712;color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;" +
                            "display:flex;align-items:center;justify-content:center;height:100vh;margin:0;padding:24px;box-sizing:border-box;text-align:center;}" +
                            ".card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);backdrop-filter:blur(24px);padding:32px 24px;border-radius:24px;max-width:360px;width:100%;}" +
                            "h2{color:#38bdf8;font-size:20px;font-weight:700;margin:0 0 12px;letter-spacing:-0.02em;}" +
                            "p{color:#94a3b8;font-size:14px;line-height:1.5;margin:0 0 24px;}" +
                            ".btn{display:inline-block;background:linear-gradient(135deg,#38bdf8,#6366f1);color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:14px;font-size:14px;font-weight:600;border:none;cursor:pointer;box-shadow:0 8px 24px rgba(56,189,248,0.25);}" +
                            "</style></head><body>" +
                            "<div class='card'>" +
                            "<h2>Connection Issue</h2>" +
                            "<p>EduBridge could not connect to the cloud servers. Please check your internet connection and try again.</p>" +
                            "<button class='btn' onclick='location.reload()'>Retry Connection</button>" +
                            "</div></body></html>";
                    view.loadDataWithBaseURL(null, errorHtml, "text/html", "UTF-8", null);
                }
            }

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, android.net.http.SslError error) {
                // Strict SSL validation - never bypass SSL certificates in production
                handler.cancel();
            }

            @Override
            public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                if (webView != null) {
                    webView.destroy();
                }
                recreate();
                return true;
            }
        });

        swipeRefresh.setOnRefreshListener(() -> webView.reload());

        // Load the production EduBridge URL
        webView.loadUrl(getTargetUrl());
    }

    private String getTargetUrl() {
        SharedPreferences prefs = getSharedPreferences(PREF_NAME, MODE_PRIVATE);
        String saved = prefs.getString(KEY_SERVER_URL, EDUBRIDGE_PRODUCTION_URL);
        // Automatically sanitize and prevent localhost / HTTP developer URLs
        if (saved == null || saved.isEmpty() || saved.contains("192.168.") || saved.contains("localhost") || saved.contains("10.0.") || saved.startsWith("http://")) {
            prefs.edit().putString(KEY_SERVER_URL, EDUBRIDGE_PRODUCTION_URL).apply();
            return EDUBRIDGE_PRODUCTION_URL;
        }
        return saved;
    }

    @Override
    protected void onPause() {
        super.onPause();
        CookieManager.getInstance().flush();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView != null && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
