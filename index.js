'use strict'

const cheerio = require('cheerio')
const readFileSync = require('fs').readFileSync

function readJSON(path){
	const file = readFileSync(path, { encoding: 'utf8'})
	let ret = {}
	try{ ret = JSON.parse(file) }
	catch(e){ ret = {} }
	finally{ return ret }
}

function getFigureIndex(figKey, figures){
	return Object.keys(figures).indexOf(figKey)
}

// This should be a config var, but for some reason,
// between the filter and the block, the variable got flushed 
let insertedFigures = []

module.exports = {
	book: {
		assets: './assets',
		css: ["style.css"]
	},
	hooks: {
		init: function(){
			const cfg = readJSON(this.config.get('pluginsConfig')['index-of-figures'].path)
			this.config.set('figures', cfg.figures)
			this.config.set('figurePrefix', cfg.prefix || 'Fig.')
			insertedFigures = []
		},
		page: function( page ){
			const $ = cheerio.load(page.content)
			const prefix = this.config.get('figurePrefix')
			const figs = {}
			
			// Find the figures from fig caption
			$('figure').each(function(){
				const num = $(this).attr('id')
				const src = $('img', this).first().attr('src')
				figs[src] = num
			})

			// Find the referenced figure and substitute text with assigned fig number
			$('a[class*="fig-ref-"]').each(function(){
				const css = $(this).attr('class')
				const key = figs[css.replace('fig-ref-', '')]
				$(this).text(`${prefix} ${key.replace(/(?:[^0-9]+)?([0-9]+(?:\.[0-9])*)/gi, '$1')}`)
			})

			page.content = $.html()
			return page
		}
	},
	filters: {
		fig: function( key ){

			let ret = '[Figure not found]'
			const figure = this.config.get('figures')[key]

			if( figure !== undefined ){
				const index = getFigureIndex(key, this.config.get('figures'))
				if( index !== undefined ){

					insertedFigures.push(key)

					// ToDo => Find figure indexed number from figcaption
					ret = `<a href="Figures.html#fig-${index + 1}" class="fig-ref-${figure.path}">Fig. ${index + 1}</a>`
				}
			}
			return ret
		}
	},
	blocks: {
		figures: {
			process: function( block ){

				const allFigures = this.config.get('figures')
				
				if( insertedFigures.length === 0 ){
					return ''
				}

				let result = '<table class="figures">'

				// Sort by index in figures json, not by insertion.
				// Insertion is done in processing order, which is done alphabetically,
				// this does not ensures figure-document order
				insertedFigures.sort((a, b) => getFigureIndex(a, allFigures) - getFigureIndex(b, allFigures))
				insertedFigures.forEach(function( figKey ){                

					const index = getFigureIndex(figKey, allFigures) + 1

					result += `<tr><td><span class="figure-number" id="fig-${index}">${index}</span></td><td>`
					result += allFigures[figKey].description
					result += '</td></tr>'
				})

				result += '</table>'

				return result
			}
		}
	}
}
