slug = BandcampVolume

all:
	mkdir -p dist/
	zip -r -FS dist/$(slug).zip * -x '*.git*' -x 'dist/*' -x 'fonts/*' -x README.md -x Makefile
	cp dist/$(slug).zip dist/$(slug).xpi

clean:
	rm -f dist/$(slug).{zip,xpi}
