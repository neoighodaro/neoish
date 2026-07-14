---
slug: "14-teaching-my-ai-agents-to-update-dependencies-safely"
title: "Wie ich meinen KI-Agenten beibringe, Dependencies zu aktualisieren, ohne mich zu ruinieren"
seo_title: "Sichere Dependency-Updates mit KI-Agenten: Claude Code Skills für sichere PHP- und JS-Paket-Updates"
description: "Meine Agenten sollen Dependency-Updates übernehmen, ohne mich in einen Supply-Chain-Angriff zu führen. Also habe ich ihnen ein Regelwerk geschrieben."
date: "2026-07-14 10:00:00"
reading_minutes: 5
tags: claude code, ki-agenten, supply chain security, composer, npm, pnpm, skills
featured: false
---

Es ist nicht ungewöhnlich, dass bei Projekten Wochen oder sogar Monate zwischen Dependency-Updates vergehen. Und wenn dann doch aktualisiert wird, dann mit voller Wucht: alles auf einmal, ohne irgendetwas zu prüfen.

Das war schon immer riskant, aber in der neuen Welt, in der KI-Agenten die Updates übernehmen, kollidiert diese Gewohnheit frontal mit einer sehr realen Bedrohung: Supply-Chain-Angriffen.

## Das Problem: `install` ist ein Feature zur Ausführung von beliebigem Code

Die Package-Ökosysteme, von denen wir alle abhängen, haben in den letzten Jahren eindrucksvoll gezeigt, wie schlimm das werden kann. Im September 2025 begannen [`chalk` und `debug`](https://www.wiz.io/blog/widespread-npm-supply-chain-attack-breaking-down-impact-scope-across-debug-chalk), Teil einer Gruppe von achtzehn Paketen mit zusammen über zwei Milliarden wöchentlichen Downloads, einen Krypto-Clipper auszuliefern, nachdem der npm-Account eines Maintainers über eine gefälschte 2FA-Reset-Mail gephisht worden war.

Wenige Tage später fraß sich der [Shai-Hulud-Wurm](https://unit42.paloaltonetworks.com/npm-supply-chain-attack/) eigenständig durch Hunderte Pakete: Sein Post-Install-Skript stahl npm-Tokens von jeder Maschine, auf der es landete, und veröffentlichte damit weitere infizierte Versionen von sich selbst. Und ein paar Wochen davor platzierte der [Nx-Vorfall](https://nx.dev/blog/s1ngularity-postmortem) eine Post-Install-Payload auf Entwicklermaschinen, die lokal installierte KI-Coding-CLIs wie Claude und Gemini dazu brachte, Wallets und Zugangsdaten für die Exfiltration aufzuspüren. Spätestens da sollte jeder aufhorchen, der Agenten einsetzt: unsere eigenen Agenten, als Einbrecher rekrutiert. Das Muster ist konsistent: Eine bösartige Version geht live, richtet ein paar Stunden oder Tage Schaden an und wird dann entdeckt und entfernt.

Deshalb habe ich entschieden, keine Updates mehr zu machen, bevor nicht eine Reihe von Regeln erfüllt ist. Und diese Regeln habe ich in Claude Skills gegossen, damit meine Agenten sich daran halten.

## KI-Agenten-Skills: Paranoia als Konfigurationsdatei

In Claude Code ist ein **Skill** einfach eine Markdown-Datei mit Anweisungen, die der Agent lädt, wenn eine Aufgabe passt. Das gibt mir die Möglichkeit, meine hart erarbeitete Paranoia *einmal* aufzuschreiben und sie *jedes einzelne Mal* angewendet zu bekommen, von etwas, das nie müde wird, nie an einem Freitagnachmittag schlampig arbeitet und nie denkt: „Ach, wird schon passen."

Ich habe erst mal zwei davon geschrieben, `package-update-js` und `package-update-php`, einen für meine TypeScript-Projekte, einen für meine Laravel-PHP-Projekte. Sie unterscheiden sich im Tooling, aber sie kodieren dieselbe Weltsicht. Das sind die Regeln.

## Regel 1: Erst recherchieren, dann anfassen

Die erste Phase ist gar kein Update. Der Agent muss zuerst Supply-Chain-Vorfälle der letzten sechs Monate recherchieren: kompromittierte Pakete, Typosquatting-Kampagnen und verdächtige Maintainer-Wechsel (genau der Vektor hinter [`event-stream`](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident) im Jahr 2018, als ein hilfsbereiter Fremder anbot, die Wartung zu übernehmen, und dann klammheimlich einen Bitcoin-Wallet-Dieb an zwei Millionen wöchentliche Downloads auslieferte). Diese Vorfälle gleicht er mit der tatsächlichen Dependency-Liste des Projekts ab, zusätzlich läuft das Audit der Registry selbst (`composer audit`, die npm-Advisory-Daten). Jedes Paket bekommt ein Urteil: **SAFE**, **AFFECTED** oder **INVESTIGATE**.

Erst wenn dieser Bericht existiert, wird irgendetwas aktualisiert.

## Regel 2: Die Sieben-Tage-Quarantäne

Das ist die Regel, die ich dem ganzen Ökosystem eintätowieren würde, wenn ich könnte: **Installiere niemals eine Version, die jünger als sieben Tage ist.** Einige Package Manager, etwa pnpm und Bun, unterstützen inzwischen ein Mindestalter für Releases und machen die Regel leicht durchsetzbar.

Kompromittierte Releases sind fast immer kurzlebig. Die vergifteten `chalk`- und `debug`-Versionen waren rund zwei Stunden online, bevor npm sie entfernte. Die bösartigen Nx-Releases hielten vier. Die bösartige Version wird veröffentlicht, jemand bemerkt es, sie wird zurückgezogen. Eine Altersschranke für Releases bedeutet, dass das vergiftete Zeitfenster komplett an dir vorbeizieht. Jeder der oben genannten Vorfälle wäre an mir vorbeigesegelt, ohne je eine meiner Maschinen zu berühren. Nicht weil ich so wachsam bin, sondern weil die Versionen zu frisch gewesen wären, um installiert zu werden.

In meinen pnpm-Projekten ist das eine einzige Zeile in der `pnpm-workspace.yaml` (der Wert ist in Minuten, 10080 sind also sieben Tage):

```yaml
minimumReleaseAge: 10080
```

Seit [pnpm 11](https://pnpm.io/supply-chain-security) bekommst du sogar standardmäßig eine Quarantäne von einem Tag, und Bun kennt dieselbe Idee als `minimumReleaseAge` in der `bunfig.toml`. Composer hat kein Äquivalent, also erzwingt der PHP-Skill die Regel manuell: Er liest das Release-Datum jeder Kandidaten-Version, und alles, was jünger als sieben Tage ist, wird übersprungen und als „zu frisch, später prüfen" markiert.

Es gibt eine Ausnahme, und die wirkt in die andere Richtung: Ein Release, das eine bekannte CVE behebt, geht sofort durch, Quarantäne hin oder her. Eine Sicherheitslücke, die gerade bei dir läuft, ist ein größeres Risiko als eine Version, die drei Tage alt ist.

## Regel 3: Skripte laufen erst, wenn ich es sage

Jedes Composer-Update läuft mit `--no-scripts`. Post-Install-Skripte sind der klassische Weg, eine Payload auszuliefern: voller Shell-Zugriff, automatisch ausgelöst, auf deiner Maschine. Genau so hat Nx SSH-Keys und Wallets abgegriffen, und genau so hat Shai-Hulud die npm-Tokens gefunden, mit denen er sich weiterverbreitet hat.

Der Skill installiert das Paket, lässt die Verifikation laufen und regeneriert Autoload und Skripte erst, nachdem das Update begutachtet wurde.

Die JS-Seite ist Composer hier voraus. pnpm weigert sich, Build-Skripte von Dependencies auszuführen, solange sie nicht explizit auf einer Allowlist stehen. Meine `pnpm-workspace.yaml` nennt die einzigen zwei Pakete, die bei der Installation überhaupt etwas ausführen dürfen:

```yaml
allowBuilds:
  esbuild: true
  sharp: true
```

Alles andere wird installiert, aber nie ausgeführt. Dieselbe Datei setzt `blockExoticSubdeps: true`, was verhindert, dass transitive Dependencies aus irgendwelchen Git-Repos oder Tarball-URLs statt aus der Registry kommen. Bun verfolgt einen ähnlichen Ansatz und führt Lifecycle-Skripte beliebiger Dependencies standardmäßig gar nicht aus.

## Regel 4: Alles pinnen, exakt

Kein `^`, kein `~`, keine Ranges. Jede Dependency wird auf eine exakte Version gepinnt, und Updates passieren über ein explizites `composer require paket:1.2.3` oder `pnpm add paket@1.2.3`, nie über einen pauschalen Update-Befehl. Meine `pnpm-workspace.yaml` unterstützt das mit `savePrefix: ""`, womit pnpm standardmäßig exakte Versionen statt `^`-Ranges speichert. Das bewirkt zwei Dinge: Jede Versionsänderung ist im Diff sichtbar (nichts driftet still bei der nächsten Lockfile-Regenerierung), und der Agent kann nie „aus Versehen" etwas reinziehen, das ich nicht abgesegnet habe.

## Regel 5: Eins nach dem anderen, danach verifizieren

Die Skills verbieten es, alles auf einmal zu aktualisieren. Jedes Paket — oder jede Ökosystem-Gruppe, denn Dinge wie die Laravel-Core-Pakete oder die TanStack-Familie müssen sich gemeinsam bewegen — wird einzeln aktualisiert, direkt gefolgt von der Verifikation: Type-Checks bei TypeScript, PHPStan plus die komplette Testsuite bei PHP. Wenn etwas kaputtgeht, wissen wir genau, welches Update es war. Major-Versionen werden nie eingespielt, ohne mir die Breaking Changes zu präsentieren und ein explizites Ja von mir zu bekommen.

## Die unvernünftige Wirksamkeit aufgeschriebener Regeln

Und hier kommt das, was mich überrascht hat: Der Agent, der diesen Skills folgt, macht Updates *sicherer*, als ich es je von Hand getan habe. Ich habe Changelogs übersprungen, wenn ich müde war. Ich habe nicht ein einziges Mal das Release-Datum eines Pakets geprüft, bevor ich es installiert habe. Und ich habe meine gesamte Karriere lang `composer update` mit aktivierten Skripten laufen lassen.

Der Skill überspringt keine Schritte, weil Schritte-Überspringen nicht in der Datei steht. Das Delegieren hat die Sicherheitslatte nicht gesenkt — das Schreiben des Regelwerks hat mich gezwungen, sie höher zu legen, und der Agent hält sie dort. Die Updates passieren jetzt jede Woche, und jemand anderes prüft sie vorher auf Gift.
